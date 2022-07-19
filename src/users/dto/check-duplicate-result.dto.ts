import { Expose } from "class-transformer";

export class CheckDuplicateResultDto {
  @Expose()
  public message: string;

  @Expose()
  public duplicate_key: string;

  constructor(result: CheckDuplicateResultDto){
    Object.assign(this, result);
  }
}