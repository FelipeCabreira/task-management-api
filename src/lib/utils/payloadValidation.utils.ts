import { PayloadError } from '@exceptions';

export const validator = (Schema: any) => (payload: any) =>
  Schema.validate(payload, { abortEarly: false });

export const fieldErrorsHandler = (validatorData: any) => {
  const { error }: any = validatorData;
  if (error && error.length) {
    const otherErrors = error.details.map((err: any) => ({
      key: err?.path.join('.'),
      message: err?.message.replaceAll(`\"`, ''),
    }));
    const message = error.message.replaceAll(`\"`, '');
    throw new PayloadError(message, otherErrors);
  }
};
