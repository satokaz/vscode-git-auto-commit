// 'use strict';

// import * as vscode from 'vscode';
// import * as cp from 'child_process';
// import { CheckStatus } from './gitStatusCheckProvider';


// const options = {
//     cwd: `${vscode.workspace.rootPath}`,
//     LANG: 'en_US.UTF-8'
// };

// export function parse_status() {

//     let check = new CheckStatus;
//     let status = gitStatus();

//     console.warn("check_nothing_to_commit() =", check.nothing_to_commit(status));
//     console.warn("check_no_changes_added_to_commit() =", check.no_changes_added_to_commit(status));
//     console.warn("check_changes_to_be_committed() =", check.changes_to_be_committed(status));
//     console.warn("check_changes_not_staged() =", check.changes_not_staged(status));

//     let commitMsg: string;

//     if(check.changes_to_be_committed(status)) {

//         console.log(" -> check_changes_to_be_committed in parse_status");

//         let msg = cp.execSync('git status | sed -n -e "/Changes/,/Changes not staged/p" | sed -n -e "/Changes/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g"', options);
//         // console.log('1 =',msg.toString());
//         commitMsg = summarize(msg.toString());
//         // console.log(commitMsg);
//     } else if(check.changes_not_staged(status)) {

//         console.log("-> check_changes_not_staged in parse_status");

//         let msg = cp.execSync('(git status | sed -n -e "/Changes not staged/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g")', options);

//         // console.log('2 =', msg.toString());
//         commitMsg = summarize(msg.toString());
//         // console.log(commitMsg);
//     }
//     commitMsg = commitMsg + '\n\n' + gitDiffStat();
//     console.log('commitmsg =',`"${commitMsg}"`);

//     return commitMsg;
// }

// function summarize(msg) {
//     let line: string;
//     return msg.replace(/:  /ig, ":")
//     .replace(/modified:/ig, "update")
//     .replace(/deleted:/ig, "delete");
// }

// export function gitStatus() {
//     try {
//         return cp.execSync('git status', options).toString();

//     } catch(err) {
//         console.log({
//             gitStatus_stdout: err.stdout.toString(),
//             gitStatus_stderr: err.stderr.toString()
//         });
//     }
// }
//
// export function gitDiffStat() {
//     try {
//         return cp.execSync('git diff --stat --no-color', options).toString();
//     } catch(err) {
//         console.log({
//             gitStatus_stdout: err.stdout.toString(),
//             gitStatus_stderr: err.stderr.toString()
//         });
//     }
// }
