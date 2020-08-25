import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotifictaionRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotifictaionRepository = new FakeNotificationsRepository();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotifictaionRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 19, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 7, 19, 13),
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider-id');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 7, 19, 12).getTime();
        });

        const appointmentDate = new Date(2020, 7, 19, 14);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 19, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 7, 19, 11),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 19, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 7, 19, 13),
                user_id: 'user-id',
                provider_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am or after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 19, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 7, 20, 7),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 7, 20, 19),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
