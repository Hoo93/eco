import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Verification} from "./entities/verification.entity";
import {Repository} from "typeorm";

@Injectable()
export class VerificationsService {

    constructor(
        @InjectRepository(Verification) verificationRepository: Repository<Verification>
    ) {
    }
}
