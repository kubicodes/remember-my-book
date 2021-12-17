import { Field, ObjectType } from "type-graphql";
import { User } from "../../../entities/User";
import { FieldError } from "../../common_types/error_response/FieldError";

@ObjectType()
export class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
