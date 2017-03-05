'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as util from 'util';
import {
    check_nothing_to_commit,
    check_no_changes_added_to_commit,
    check_changes_to_be_committed,
    check_changes_not_staged
} from './gitStatusCheckProvider';

const options = {
    cwd: `${vscode.workspace.rootPath}`
};

export function parse_status() {

    console.warn("check_nothing_to_commit() =", check_nothing_to_commit());
    console.warn("check_no_changes_added_to_commit() =", check_no_changes_added_to_commit());
    console.warn("check_changes_to_be_committed() =", check_changes_to_be_committed());
    console.warn("check_changes_not_staged() =", check_changes_not_staged());

    let commitMsg: string;

    if(check_changes_to_be_committed()) {

        console.log(" -> check_changes_to_be_committed in parse_status");

        let msg = cp.execSync('git status | sed -n -e "/Changes/,/Changes not staged/p" | sed -n -e "/Changes/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g"', options);
        // console.log('1 =',msg.toString());
        commitMsg = summarize(msg.toString());
        // console.log(commitMsg);
    } else if(check_changes_not_staged()) {

        console.log("-> check_changes_not_staged in parse_status");

        let msg = cp.execSync('(git status | sed -n -e "/Changes not staged/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g")', options);

        console.log('2 =', msg.toString());
        commitMsg = summarize(msg.toString());
        // console.log(commitMsg);
    }
    console.log('commitmsg =',`"${commitMsg}"`);
    return commitMsg;
}

function summarize(msg) {
    let line: string;
    return msg.replace(/:  /ig, ":")
    .replace(/modified:/ig, "update")
    .replace(/deleted:/ig, "delete");
}
