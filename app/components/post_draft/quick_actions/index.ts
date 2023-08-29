// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import {of as of$} from 'rxjs';

import {queryAllCustomEmojis} from '@queries/servers/custom_emoji';
import {observeIsPostPriorityEnabled} from '@queries/servers/post';
import {observeCanUploadFiles, observeConfigBooleanValue, observeMaxFileCount} from '@queries/servers/system';

import QuickActions from './quick_actions';

import type {WithDatabaseArgs} from '@typings/database/database';
import type CustomEmojiModel from '@typings/database/models/servers/custom_emoji';

const emptyEmojiList: CustomEmojiModel[] = [];
const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const canUploadFiles = observeCanUploadFiles(database);
    const maxFileCount = observeMaxFileCount(database);
    const isCustomEmojiEnabled = observeConfigBooleanValue(database, 'EnableCustomEmoji');

    return {
        canUploadFiles,
        customEmojis: isCustomEmojiEnabled.pipe(
            switchMap((enabled) => (enabled ? queryAllCustomEmojis(database).observe() : of$(emptyEmojiList))),
        ),
        isPostPriorityEnabled: observeIsPostPriorityEnabled(database),
        maxFileCount,
    };
});

export default React.memo(withDatabase(enhanced(QuickActions)));
