'use strict';

import * as vscode from 'vscode';
import * as cp from 'child_process';

export class CheckStatus {
    private disposables: vscode.Disposable[] = [];
    private options = {
        cwd: `${vscode.workspace.rootPath}`,
        LANG: 'en_US.UTF-8'
    };
    
    constructor() {
    }

    public parse_status() { 
        {
            // let check = new checkStatus;
            let status = this.gitStatus();

            // console.warn("check_nothing_to_commit() =", this.nothing_to_commit(status));
            // console.warn("check_no_changes_added_to_commit() =", this.no_changes_added_to_commit(status));
            // console.warn("check_changes_to_be_committed() =", this.changes_to_be_committed(status));
            // console.warn("check_changes_not_staged() =", this.changes_not_staged(status));

            let commitMsg: string;

            if(this.changes_to_be_committed(status)) {

                console.log(" -> check_changes_to_be_committed in parse_status");

                // これ、Windows でどう実装すればいいの・・・
                let msg = cp.execSync('git status | sed -n -e "/Changes/,/Changes not staged/p" | sed -n -e "/Changes/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g"', this.options);
                // console.log('1 =',msg.toString());
                
                commitMsg = this.summarize(msg.toString());
                // console.log(commitMsg);
            } else if(this.changes_not_staged(status)) {

                console.log("-> check_changes_not_staged in parse_status");
                // これ、Windows でどう実装すればいいの・・・
                let msg = cp.execSync('(git status | sed -n -e "/Changes not staged/,/Untrack/p" | grep $"\t" | sed -e "s/^\t//g")', this.options);

                // console.log('2 =', msg.toString());
                commitMsg = this.summarize(msg.toString());
            }
            // commitMsg = commitMsg; // + '\n\n' + this.gitDiffStat();
            console.log('commitmsg =',`"${commitMsg}"`);

            return commitMsg;
        }
    }

    public summarize(msg) {
        let line: string;
        return msg.replace(/:  /ig, ":")
        .replace(/modified:/ig, "update")
        .replace(/deleted:/ig, "delete");
    }

    public gitStatus() {
        try {
            return cp.execSync('git status', this.options).toString();
        } catch(err) {
            console.log({
                gitStatus_stdout: err.stdout.toString(),
                gitStatus_stderr: err.stderr.toString()
            });
        }
    }

    // nothing to commit, working tree clean
    public nothing_to_commit(status) {
        return (status.match('nothing to commit')) ? true : false;
    }

    // no changes added to commit (use "git add" and/or "git commit -a")
    public no_changes_added_to_commit(status) {
        return (status.match('no changes added to commit')) ? true : false;
    }

    // Example:
    // Changes not staged for commit:
    //   (use "git add <file>..." to update what will be committed)
    //   (use "git checkout -- <file>..." to discard changes in working directory)
    //
    //         modified:   .gitignore
    public changes_not_staged(status) {
        return (status.match('Changes not staged for commit.')) ? true : false;
    }

    // Example:
    // Changes to be committed:
    //   (use "git reset HEAD <file>..." to unstage)
    //
    //         new file:   new.md
    public changes_to_be_committed(status) {
        return (status.match('Changes to be committed.')) ? true : false;
    }

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
	}

    // public gitDiffStat() {
    //     try {
    //         return cp.execSync('git diff --stat --no-color', this.options).toString();
    //     } catch(err) {
    //         console.log({
    //             gitStatus_stdout: err.stdout.toString(),
    //             gitStatus_stderr: err.stderr.toString()
    //         });
    //     }
    // }
}