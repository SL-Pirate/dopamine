import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { FolderService } from '../app/services/folder/folder.service';
import { Logger } from '../app/core/logger';
import { Folder } from '../app/data/entities/folder';
import { BaseSnackbarService as SnackBarServiceBase } from '../app/services/snack-bar/base-snack-bar.service';
import { BaseFolderRepository } from '../app/data/repositories/base-folder-repository';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const snackBarServiceMock: IMock<SnackBarServiceBase> = Mock.ofType<SnackBarServiceBase>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolder('/home/me/Music')).returns(() => null);

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolder('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const snackBarServiceMock: IMock<SnackBarServiceBase> = Mock.ofType<SnackBarServiceBase>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolder('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolder('/home/me/Music'), Times.never());
        });

        it('Should notify the user if a folder was already added', async () => {
            // Arrange
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const snackBarServiceMock: IMock<SnackBarServiceBase> = Mock.ofType<SnackBarServiceBase>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolder('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            snackBarServiceMock.verify(x => x.notifyFolderAlreadyAddedAsync(), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', () => {
            // Arrange
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const snackBarServiceMock: IMock<SnackBarServiceBase> = Mock.ofType<SnackBarServiceBase>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            // Act
            folderService.getFolders();

            // Assert
            folderRepositoryMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should delete a folder from the database', () => {
            // Arrange
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const snackBarServiceMock: IMock<SnackBarServiceBase> = Mock.ofType<SnackBarServiceBase>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            const folderToDelete: Folder = new Folder('/home/user/Music');

            // Act
            folderService.deleteFolder(folderToDelete);

            // Assert
            folderRepositoryMock.verify(x => x.deleteFolder('/home/user/Music'), Times.exactly(1));
        });
    });
});
