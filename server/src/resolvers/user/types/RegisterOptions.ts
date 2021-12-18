import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterOptions {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
