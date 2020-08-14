import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'jhondoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should be able to authenticate with non existing user', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        await expect(
            authenticateUser.execute({
                email: 'jhondoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with incorrect email/password combination', async () => {
        const fakeUserRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'jhondoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
