'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as util from 'util';

const options = {
    cwd: `${vscode.workspace.rootPath}`
};

// nothing to commit, working tree clean
export function check_nothing_to_commit() {
    try{
        let status = cp.execSync('git status | grep "nothing to commit, working tree clean"', options);
        // console.log(status.toString());
        if (status.toString().match('nothing to commit')) {
            return true;
        }
    } catch(err){
        console.log({
            check_nothing_to_commit_stdout: err.stdout.toString(),
            check_nothing_to_commit_stderr: err.stderr.toString(),
        });
    }
    return false;
}

// no changes added to commit (use "git add" and/or "git commit -a")
export function check_no_changes_added_to_commit() {
    try{
        let status = cp.execSync('git status | grep "no changes added to commit"', options);
        // console.log(status.toString());
        if (status.toString().match('no changes added to commit')) {
            return true;
        }
    } catch(err){
        console.log({
            check_no_changes_added_to_commit_stdout: err.stdout.toString(),
            check_no_changes_added_to_commit_stderr: err.stderr.toString(),
        });
    }
    return false;
}

// Example:
// Changes to be committed:
//   (use "git reset HEAD <file>..." to unstage)
//
//         new file:   new.md
export function check_changes_to_be_committed() {
    try{
        // let status = execSync('git status | grep "Changes to be committed"', { cwd: folderPath });
        let status = cp.execSync('git status | grep "Changes to be committed"', options);
        // console.log(status.toString());
        if (status.toString().match('Changes to be committed.')) {
            return true;
        }
    } catch(err){
        console.log({
            check_changes_to_be_committed_stdout: err.stdout.toString(),
            check_changes_to_be_committed_stderr: err.stderr.toString(),
        });
    }
    return false;
}

// Example:
// Changes not staged for commit:
//   (use "git add <file>..." to update what will be committed)
//   (use "git checkout -- <file>..." to discard changes in working directory)
//
//         modified:   .gitignore
export function check_changes_not_staged() {
    try{
        // let status = execSync('git status | grep "Changes not staged for commit"', { cwd: folderPath });
        let status = cp.execSync('git status | grep "Changes not staged for commit"', options);
        // console.log(status.toString());
        if (status.toString().match('Changes not staged for commit.')) {
            return true;
        }
    } catch(err) {
            console.log({
            check_changes_not_staged_stdout: err.stdout.toString(),
            check_changes_not_staged_stderr: err.stderr.toString(),
        });
    }
    return false;
}