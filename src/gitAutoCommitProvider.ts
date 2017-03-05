'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as util from 'util';
import {parse_status} from './gitStatusParseProvider';
import {
    check_nothing_to_commit,
    check_no_changes_added_to_commit,
    check_changes_to_be_committed,
    check_changes_not_staged } from './gitStatusCheckProvider';

const options = {
    cwd: `${vscode.workspace.rootPath}`
};

export function autoCommit() {
    util.log("exec autoCommit");
    let autostage = true;

    // launch.json configuration
    const config = vscode.workspace.getConfiguration('git-autoCommit');
    let values = (config.get('interval') === undefined) ? Number(1800000) : +config.get('interval'); // +:Type conversion from string to number
    console.log('values =', values);

    console.time('timer');
        console.log('msg =', parse_status());
    console.timeEnd('timer');

    try {
        if (check_nothing_to_commit() === !true ) {
            if(check_no_changes_added_to_commit() !== true) {
                console.log('git commit -m ' + parse_status());
                cp.execSync('git commit -m ' + '"' + parse_status() + '"', options);
            } else if (config.get('autostage')) {
                console.log('git commit -am ' + parse_status());
                cp.execSync('git commit -am ' + '"' + parse_status() + '"', options);
            }
        }
    } catch(err) {
        console.log({
            commit_stdout: err.stdout.toString(),
            commit_stderr: err.stderr.toString(),
        });
    }
    setTimeout(autoCommit, values);
}