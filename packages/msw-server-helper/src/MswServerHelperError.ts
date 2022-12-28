export class MswServerHelperError extends Error {
  public readonly prismaError: Error
  constructor(message: string, prismaError: Error) {
    super(message)

    this.prismaError = prismaError
  }
}
