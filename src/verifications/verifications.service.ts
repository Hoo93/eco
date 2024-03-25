import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Verification} from "./entities/verification.entity";
import {Repository} from "typeorm";
import { CommonResponseDto } from "../common/response/common-response.dto";

@Injectable()
export class VerificationsService {

    constructor(
        @InjectRepository(Verification) verificationRepository: Repository<Verification>
    ) {
    }

    public createVerificationCode():CommonResponseDto<{code:string}> {
        return new CommonResponseDto("", { code: "" });
    }

    public saveVerification(code: Verification) {}
}
