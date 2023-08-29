// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Alert, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CompassIcon from '@components/compass_icon';
import {ITEM_HEIGHT} from '@components/slide_up_panel_item';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {ICON_SIZE} from '@constants/post_draft';
import {useTheme} from '@context/theme';
import {TITLE_HEIGHT} from '@screens/bottom_sheet/content';
import {bottomSheet} from '@screens/navigation';
import {fileMaxWarning} from '@utils/file';
import PickerUtil from '@utils/file/file_picker';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {changeOpacity} from '@utils/theme';

import CameraType, {type ImageOptions} from './image_type';

import type {QuickActionAttachmentProps} from '@typings/components/post_draft_quick_action';

const style = StyleSheet.create({
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
});

export default function ImageQuickAction({
    disabled,
    onUploadFiles,
    maxFilesReached,
    maxFileCount,
    fileCount = 0,
    testID,
}: QuickActionAttachmentProps) {
    const intl = useIntl();
    const theme = useTheme();
    const {bottom} = useSafeAreaInsets();

    const handleButtonPress = useCallback((options: ImageOptions) => {
        const picker = new PickerUtil(intl,
            onUploadFiles);

        if (options.source === 'camera') {
            picker.attachFileFromCamera(options);
        } else {
            picker.attachFileFromPhotoGallery(maxFileCount - fileCount);
        }
    }, [intl, onUploadFiles]);

    const renderContent = useCallback(() => {
        return (
            <CameraType
                onPress={handleButtonPress}
            />
        );
    }, [handleButtonPress]);

    const openSelectorModal = useCallback(() => {
        if (maxFilesReached) {
            Alert.alert(
                intl.formatMessage({
                    id: 'mobile.link.error.title',
                    defaultMessage: 'Error',
                }),
                fileMaxWarning(intl, maxFileCount),
            );
            return;
        }

        bottomSheet({
            title: intl.formatMessage({id: 'mobile.camera_type.title', defaultMessage: 'Camera options'}),
            renderContent,
            snapPoints: [1, bottomSheetSnapPoint(3, ITEM_HEIGHT, bottom) + TITLE_HEIGHT],
            theme,
            closeButtonId: 'camera-close-id',
        });
    }, [intl, theme, renderContent, maxFilesReached, maxFileCount, bottom]);

    const actionTestID = disabled ? `${testID}.disabled` : testID;
    const color = disabled ? changeOpacity(theme.centerChannelColor, 0.16) : changeOpacity(theme.centerChannelColor, 0.64);

    return (
        <TouchableWithFeedback
            testID={actionTestID}
            disabled={disabled}
            onPress={openSelectorModal}
            style={style.icon}
            type={'opacity'}
        >
            <CompassIcon
                color={color}
                name='image-outline'
                size={ICON_SIZE}
            />
        </TouchableWithFeedback>
    );
}
