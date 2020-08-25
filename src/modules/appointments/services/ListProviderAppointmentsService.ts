import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/iAppointmentsRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        const appoitments = await this.appointmentsRepository.findAllInDayFromProvider(
            { provider_id, day, month, year },
        );

        return appoitments;
    }
}

export default ListProviderAppointmentsService;
