'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as util from 'util';

import { autoCommit } from './gitAutoCommitProvider'
import { parse_status } from './gitStatusParseProvider';
import {
    check_nothing_to_commit,
    check_no_changes_added_to_commit,
    check_changes_to_be_committed,
    check_changes_not_staged
} from './gitStatusCheckProvider';


const options = {
    cwd: `${vscode.workspace.rootPath}`
};

if (vscode.workspace.getConfiguration('git-autoCommit')['enable'] === true) {
 console.log("git-autoCommit の設定があります");
} else {
 console.log("git-autoCommit の設定がないですよ");
}

// launch.json configuration
const config = vscode.workspace.getConfiguration('git-autoCommit');
 // retrieve values
const values = config.get('enable');

console.log(gitStatus());

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-git-auto-commit" is now active!');

    console.log("folderPath = ", options.cwd);

    let disposable = vscode.commands.registerCommand('extension.gitAutoCommit', () => {

        // setInterpreter();
    // vscode.workspace.openTextDocument(workspaceSettingsPath()).then(doc => vscode.window.showTextDocument(doc));

        // console.log(parse_status());
        autoCommit();
    });

    context.subscriptions.push(disposable);
}
export function deactivate() {
}




//https://github.com/DonJayamanne/pythonVSCode/pull/258
function workspaceSettingsPath() {
     return path.join(vscode.workspace.rootPath, '.vscode', 'settings.json')
}

function setInterpreter() {
    // For now the user has to manually edit the workspace settings to change the
    // pythonPath -> First check they have .vscode/settings.json
    let settingsPath: string
    try {
        settingsPath = workspaceSettingsPath()
    } catch (e) {
        // We aren't even in a workspace
        vscode.window.showInformationMessage("The interpreter can only be set within a workspace (open a folder)")
        return
    }
    vscode.workspace.openTextDocument(settingsPath)
        .then(doc => {
                // Great, workspace file exists. Present it for copy/pasting into...
                vscode.window.showTextDocument(doc);
                // ...and offer the quick-pick suggestions.
            },
            () => {
                // The user doesn't have any workspace settings!
                // Prompt them to create one first
                vscode.window.showInformationMessage("No workspace settings file. First, run 'Preferences: Open Workspace Settings' to create one." )
                })
}


function gitStatus() {
    try {
        return cp.execSync('git status', options).toString();
    } catch(err) {
        console.log({
            commit_stdout: err.stdout.toString(),
            commit_stderr: err.stderr.toString(),
        });
    }
}