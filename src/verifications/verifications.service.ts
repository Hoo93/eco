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
        const verificationCode = this.generateSixDigitNumber();
        return new CommonResponseDto("SUCCESS CREATE VERIFICATION CODE", { code: verificationCode });
    }

    public saveVerification(code: Verification) {}


    private generateSixDigitNumber():string {
        let result = ''

        for (let i = 0; i < 6; i ++) {
            result += Math.floor(Math.random()*10)
        }
        return result
    }
}
