// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet, View} from 'react-native';

import FileAction from './file_quick_action';
import ImageAction from './image_quick_action';
import InputAction from './input_quick_action';
import PostPriorityAction from './post_priority_action';

import type CustomEmojiModel from '@typings/database/models/servers/custom_emoji';

type Props = {
    testID?: string;
    canUploadFiles: boolean;
    fileCount: number;
    isPostPriorityEnabled: boolean;
    canShowPostPriority?: boolean;
    maxFileCount: number;

    // Draft Handler
    value: string;
    updateValue: (value: string) => void;
    addFiles: (file: FileInfo[]) => void;
    postPriority: PostPriority;
    updatePostPriority: (postPriority: PostPriority) => void;
    focus: () => void;
    customEmojis: CustomEmojiModel[];
}

const style = StyleSheet.create({
    quickActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: 44,
    },
});

export default function QuickActions({
    testID,
    canUploadFiles,
    value,
    fileCount,
    isPostPriorityEnabled,
    canShowPostPriority,
    maxFileCount,
    customEmojis,
    updateValue,
    addFiles,
    postPriority,
    updatePostPriority,
    focus,
}: Props) {
    const atDisabled = value[value.length - 1] === '@';
    const slashDisabled = value.length > 0;

    const atInputActionTestID = `${testID}.at_input_action`;
    const slashInputActionTestID = `${testID}.slash_input_action`;
    const emojiInputActionTestID = `${testID}.emoji_input_action`;
    const fileActionTestID = `${testID}.file_action`;
    const imageActionTestID = `${testID}.image_action`;
    const postPriorityActionTestID = `${testID}.post_priority_action`;

    const uploadProps = {
        disabled: !canUploadFiles,
        fileCount,
        maxFileCount,
        maxFilesReached: fileCount >= maxFileCount,
        onUploadFiles: addFiles,
    };

    return (
        <View
            testID={testID}
            style={style.quickActionsContainer}
        >
            <InputAction
                testID={atInputActionTestID}
                disabled={atDisabled}
                inputType='at'
                updateValue={updateValue}
                focus={focus}
            />
            <InputAction
                testID={slashInputActionTestID}
                disabled={slashDisabled}
                inputType='slash'
                updateValue={updateValue}
                focus={focus}
            />
            <InputAction
                testID={emojiInputActionTestID}
                inputType='emoji'
                updateValue={updateValue}
                customEmojis={customEmojis}
                focus={focus}
            />
            <FileAction
                testID={fileActionTestID}
                {...uploadProps}
            />
            {/* <ImageAction
                testID={imageActionTestID}
                {...uploadProps}
            /> */}
            <ImageAction
                testID={imageActionTestID}
                {...uploadProps}
            />
            {isPostPriorityEnabled && canShowPostPriority && (
                <PostPriorityAction
                    testID={postPriorityActionTestID}
                    postPriority={postPriority}
                    updatePostPriority={updatePostPriority}
                />
            )}
        </View>
    );
}
