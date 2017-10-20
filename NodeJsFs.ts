import fs = require('fs');
import Path = require('path');
import FileSystemInterface from 'BITNATION-Panthalassa-TS-fs-interface/FileSystemInterface'

export class NodeJsFs implements FileSystemInterface
{

    /**
     *
     * @param {string} repoPath
     * @param {typeof Path} path
     */
    constructor(private repoPath: string, private path: typeof Path) { }

    private encoding: 'utf8';

    /**
     *
     * @param {string} fileName
     * @param {string} content
     * @returns {Promise<void>}
     */
    writeFile(fileName: string, content: string): Promise<void> {

        return new Promise((resolve, reject) => {

            fs.writeFile(this.normalizePath(fileName), content, this.encoding, (err) => {

                if(err){
                    reject(err);
                }

                resolve();

            });

        });

    }

    /**
     *
     * @param {string} fileName
     * @returns {Promise<any>}
     */
    readFile(fileName:string) : Promise<any> {

        return new Promise(((resolve, reject) => {

            this.fileExist(this.normalizePath(fileName))
                .then(fileExist => {

                    if(false === fileExist){
                        reject(new Error("File: "+this.normalizePath(fileName)+" does not exist"));
                        return;
                    }

                    fs.readFile(this.normalizePath(fileName), 'utf8', (err, data) => {

                        if(err){
                            reject(err);
                            return;
                        }

                        resolve(data);

                    });


                })
                .catch(err => reject(err))

        }));

    }

    /**
     *
     * @param {string} fileName
     * @returns {boolean}
     */
    fileExist(fileName:string) : Promise<boolean> {

        return new Promise((resolve, reject) => {

            resolve(fs.existsSync(this.normalizePath(fileName)));

        });

    }

    /**
     *
     * @param {string} fileName
     * @returns {Promise<void>}
     */
    deleteFile(fileName:string) : Promise<void> {

        return new Promise((resolve, reject) => {

            fs.unlink(this.normalizePath(fileName), function (err) {

                if(err){
                    reject(err);
                    return;
                }

                resolve();

            })

        });

    }

    normalizePath(fileName:string) : string {

        return this.path.normalize(this.repoPath+'/'+fileName);

    }

}

/**
 *
 * @param {string} repoPath
 * @returns {NodeJsFs}
 */
export function factory(repoPath: string) : NodeJsFs
{
    return new NodeJsFs(repoPath, Path);
}
