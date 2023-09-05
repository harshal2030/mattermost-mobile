// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {View} from 'react-native';

import FormattedText from '@components/formatted_text';
import SlideUpPanelItem from '@components/slide_up_panel_item';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {dismissBottomSheet} from '@screens/navigation';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {CameraOptions} from 'react-native-image-picker';

type Props = {
    onPress: (options: CameraOptions) => void;
}

const getStyle = makeStyleSheetFromTheme((theme: Theme) => ({
    title: {
        color: theme.centerChannelColor,
        ...typography('Heading', 600, 'SemiBold'),
        marginBottom: 8,
    },

}));

export interface ImageOptions extends CameraOptions {
    source: 'camera' | 'library';
}

const ImageType = ({onPress}: Props) => {
    const theme = useTheme();
    const isTablet = useIsTablet();
    const style = getStyle(theme);
    const intl = useIntl();

    const onPhoto = async () => {
        const options: ImageOptions = {
            quality: 0.8,
            mediaType: 'photo',
            saveToPhotos: true,
            source: 'camera',
        };

        await dismissBottomSheet();
        onPress(options);
    };

    const onVideo = async () => {
        const options: ImageOptions = {
            videoQuality: 'high',
            mediaType: 'video',
            saveToPhotos: true,
            source: 'camera',
        };

        await dismissBottomSheet();
        onPress(options);
    };

    const onLibrary = async () => {
        const options: ImageOptions = {
            mediaType: 'photo',
            saveToPhotos: true,
            source: 'library',
        };

        await dismissBottomSheet();
        onPress(options);
    };

    return (
        <View>
            {!isTablet &&
            <FormattedText
                id='mobile.camera_type.title'
                defaultMessage='Camera options'
                style={style.title}
            />
            }
            <SlideUpPanelItem
                icon='image-outline'
                onPress={onLibrary}
                testID=''
                text={intl.formatMessage({id: 'mobile.file_upload.library', defaultMessage: 'Photo Library'})}
            />
            <SlideUpPanelItem
                icon='camera-outline'
                onPress={onPhoto}
                testID='camera_type.photo'
                text={intl.formatMessage({id: 'camera_type.photo.option', defaultMessage: 'Capture Photo'})}
            />
            <SlideUpPanelItem
                icon='video-outline'
                onPress={onVideo}
                testID='camera_type.video'
                text={intl.formatMessage({id: 'camera_type.video.option', defaultMessage: 'Record Video'})}
            />
        </View>
    );
};

export default ImageType;
