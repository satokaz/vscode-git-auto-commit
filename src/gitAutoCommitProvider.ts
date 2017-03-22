'use strict';

import * as vscode from 'vscode';
import * as cp from 'child_process';
// import { parse_status, gitStatus} from './gitStatusParseProvider';
import { CheckStatus } from './gitStatusCheckProvider';

/**
 * AutoCommit
 */
export class AutoCommit {
    private static Period = 15000; //3 * 60 * 1000 /* three minutes */;
    private disposables: vscode.Disposable[] = [];
	private timer: NodeJS.Timer;
    private options = {
        cwd: `${vscode.workspace.rootPath}`,
        LANG: 'en_US.UTF-8'
    };
    private gitConfig = vscode.workspace.getConfiguration('git-autoCommit');

    constructor() {
        vscode.workspace.onDidChangeConfiguration(this.onConfiguration, this, this.disposables);
        this.onConfiguration();
        let status = new CheckStatus().gitStatus; //gitStatus();
    }

	private onConfiguration(): void {
        console.log('gitConfig.get', this.gitConfig.get<boolean>('autostage'));
		if (this.gitConfig.get<boolean>('autostage') === false) {
            console.log('this.disable');
			this.disable();
		} else {
            console.log('this.enable');
			this.enable();
		}
	}

	enable(): void {
        console.log("this.timer ", this.timer);
		if (this.timer) {
            console.log("this.timer ", this.timer);
			return;
		}

		this.stage();
		this.timer = setInterval(() => this.stage(), AutoCommit.Period);
	}

	disable(): void {
        console.log("clearInterval");
		clearInterval(this.timer);
        this.timer = undefined;

 	}
	// private async status(): Promise<void> {
	// 	try {
    //         // test
	// 		await new Promise( (resolve, reject) => { 
    //                 console.warn(new Date().toLocaleTimeString());
    //                 console.warn(cp.execSync('git status', this.options).toString()); 
    //                 });
	// 	} catch (err) {
    //         console.log('ログ', {
    //             status_stdout: err.stdout.toString(),
    //             status_stderr: err.stderr.toString()
    //         });
	// 	}
	// }

	private async stage(): Promise<void> {
        let check = new CheckStatus;
        let status = check.gitStatus();
		try {
            // test
			await new Promise( (resolve, reject) => { 
                console.warn(new Date().toLocaleTimeString());
                if (check.nothing_to_commit(status) !== true ) {
                    if(check.no_changes_added_to_commit(status) !== true) {
                        console.log('git commit -m ' /* + parse_status() */ );
                        // cp.execSync('git commit -m ' + '"' + parse_status() + '"', options);
                    } else if (this.gitConfig.get('autostage')) {
                        console.log('git commit -am ' + check.parse_status());
                        // cp.execSync('git commit -am ' + '"' + parse_status() + '"', options);
                    }
                }
            });
            //
		} catch (err) {
            console.log('ログ', {
                status_stdout: err.stdout.toString(),
                status_stderr: err.stderr.toString()
            });
		}
	}

	dispose(): void {
		this.disable();
		this.disposables.forEach(d => d.dispose());
	}
}


// const options = {
//     cwd: `${vscode.workspace.rootPath}`,
//     LANG: 'en_US.UTF-8'
// };

// export function autoCommit() {

//     const config = vscode.workspace.getConfiguration('git-autoCommit');
//     let values = (config.get('interval') === undefined) ? Number(1800000) : +config.get('interval'); // +:Type conversion from string to number
//     // launch.json configuration
//     // const config = vscode.workspace.getConfiguration('git-autoCommit');
//     console.log('values =', values);

//     let check = new checkStatus;
//     let autostage = true;
//     let status = gitStatus();

//     console.time('timer');
//         console.log('msg in autoCommit() =', parse_status());
//     console.timeEnd('timer');

//     try {
//         if (check.nothing_to_commit(status) === !true ) {
//             if(check.no_changes_added_to_commit(status) !== true) {
//                 console.log('git commit -m ' + parse_status());
//                 // cp.execSync('git commit -m ' + '"' + parse_status() + '"', options);
//             } else if (config.get('autostage')) {
//                 console.log('git commit -am ' + parse_status());
//                 // cp.execSync('git commit -am ' + '"' + parse_status() + '"', options);
//             }
//         }
//     } catch(err) {
//         console.log({
//             commit_stdout: err.stdout.toString(),
//             commit_stderr: err.stderr.toString(),
//         });
//     }
//     // setTimeout(autoCommit, values);
// }
