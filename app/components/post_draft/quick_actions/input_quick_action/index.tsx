// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';

import {Screens} from '@app/constants';
import {openAsBottomSheet} from '@app/screens/navigation';
import {getEmojiCode} from '@app/utils/emoji/helpers';
import {preventDoubleTap} from '@app/utils/tap';
import CompassIcon from '@components/compass_icon';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {ICON_SIZE} from '@constants/post_draft';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

type Props = {
    testID?: string;
    disabled?: boolean;
    inputType: 'at' | 'slash' | 'emoji';
    updateValue: React.Dispatch<React.SetStateAction<string>>;
    updateCursorPosition: React.Dispatch<React.SetStateAction<number>>;
    focus: () => void;
    cursorPosition: number;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        disabled: {
            tintColor: changeOpacity(theme.centerChannelColor, 0.16),
        },
        icon: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
        },
    };
});

export default function InputQuickAction({
    testID,
    disabled,
    inputType,
    cursorPosition,
    updateValue,
    updateCursorPosition,
    focus,
}: Props) {
    const theme = useTheme();
    const intl = useIntl();
    const onPress = useCallback(() => {
        if (inputType === 'at') {
            updateValue((v) => {
                const part1 = v.substring(0, cursorPosition) + '@';
                const part2 = v.substring(cursorPosition);

                const value = part1 + part2;

                updateCursorPosition(part1.length);
                return value;
            });
            focus();
        } else if (inputType === 'slash') {
            updateValue((v) => `/${v}`);
            focus();
        } else {
            openEmojiPicker();
        }
    }, [inputType, cursorPosition, updateValue, updateCursorPosition]);

    const handleEmojiClick = useCallback((emoji: string) => {
        updateValue((v) => {
            const emojiCode = getEmojiCode(emoji, []);

            const part1 = v.substring(0, cursorPosition) + `${emojiCode} `;
            const part2 = v.substring(cursorPosition);

            const value = part1 + part2;

            updateCursorPosition(part1.length);
            return value;
        });
        focus();
    }, [cursorPosition, updateValue, updateCursorPosition]);

    const openEmojiPicker = useCallback(preventDoubleTap(() => {
        openAsBottomSheet({
            closeButtonId: 'close-emoji-picker',
            screen: Screens.EMOJI_PICKER,
            theme,
            title: intl.formatMessage({id: 'mobile.custom_status.choose_emoji', defaultMessage: 'Choose an emoji'}),
            props: {onEmojiPress: handleEmojiClick},
        });
    }), [theme, intl, handleEmojiClick]);

    const actionTestID = disabled ? `${testID}.disabled` : testID;
    const style = getStyleSheet(theme);
    const iconColor = disabled ? changeOpacity(theme.centerChannelColor, 0.16) : changeOpacity(theme.centerChannelColor, 0.64);

    let iconName: string;

    if (inputType === 'at') {
        iconName = inputType;
    } else if (inputType === 'slash') {
        iconName = 'slash-forward-box-outline';
    } else {
        iconName = 'emoticon-happy-outline';
    }

    return (
        <TouchableWithFeedback
            testID={actionTestID}
            disabled={disabled}
            onPress={onPress}
            style={style.icon}
            type={'opacity'}
        >
            <CompassIcon
                name={iconName}
                color={iconColor}
                size={ICON_SIZE}
            />
        </TouchableWithFeedback>
    );
}
