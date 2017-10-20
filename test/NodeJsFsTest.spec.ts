import {factory, NodeJsFs} from './../NodeJsFs'
import Path = require('path');
import {existsSync, unlinkSync} from "fs";

describe('NodeJsFs', () => {

    describe('Method - writeFile', () => {

        test('error during writing file', async () => {

            const repoPath:string = '/i-dont-exist';

            const filePath:string = Path.normalize(repoPath+'test-file.txt');

            let nfs:NodeJsFs = new NodeJsFs('/i-dont/exist', Path);

            let error:any;

            try{
                await nfs.writeFile(filePath, 'hi');
            }catch (e) {
                error = e;
            }

            //Todo check if that is a right way, could the error be thrown
            expect(JSON.stringify(error))
                .toBe('{"errno":-2,"code":"ENOENT","syscall":"open","path":"/i-dont/exist/i-dont-existtest-file.txt"}')

        });

        test('writing file successfully', async () => {

            const filePath:string = 'test.txt'+Math.random();

            let nfs:NodeJsFs = new NodeJsFs('.', Path);

            await nfs.writeFile(filePath, 'hi');

            expect(await nfs.fileExist(filePath)).toBeTruthy();

            await nfs.deleteFile(filePath)

        });

    });

    describe('Method - readFile', () => {

        test('read file that does not exist', async () => {

            const fileName:string = Math.random()+'.txt';

            const nodeFs:NodeJsFs = new NodeJsFs('.', Path);

            let error:any;

            try{
                await nodeFs.readFile(fileName);
            }catch (e) {
                error = e;
            }

            //Prove if there is a way to assert instance of error class
            expect(error.message).toBe('File: '+nodeFs.normalizePath(fileName)+' does not exist');

        });

        test('read file successfully', async () => {

            const fileName = Math.random()+'.txt';

            const nodeFs:NodeJsFs = new NodeJsFs('./', Path);

            await nodeFs.writeFile(fileName, 'test content');

            let response:any;

            try{
                response = await nodeFs.readFile(fileName)
            }catch (e){
                response = e;
            }

            expect(response).toBe('test content');

            nodeFs.deleteFile(fileName);

        });

    });

    describe('Method - factory', () => {

        test('create node js fs by factory', async () => {

           expect(factory('./')).toBeInstanceOf(NodeJsFs);

        });

    });

    describe('Method - delete file', () => {

        test('delete file successfully', async () => {

            const nodeFs:NodeJsFs = new NodeJsFs('.', Path);

            const fileName = 'file'+Math.random();

            await nodeFs.writeFile(fileName, 'hi');

            expect(await nodeFs.fileExist(fileName)).toBeTruthy();

            await nodeFs.deleteFile(fileName);

            expect(await nodeFs.fileExist(fileName)).toBeFalsy();

        });

    });

    describe('Method - file exist', () => {

        test('check if file exist that doesn\'t exist', async () => {

            const nodeFs:NodeJsFs = new NodeJsFs('.', Path);

            expect(await nodeFs.fileExist('hi')).toBeFalsy();

        });

        test('check if file exist that does exist', async () => {

            const nodeFs:NodeJsFs = new NodeJsFs('.', Path);

            const fileName = 'file'+Math.random();

            nodeFs.writeFile(fileName, 'hi');

            expect(nodeFs.fileExist(fileName)).toBeTruthy();

        })

    });

});
