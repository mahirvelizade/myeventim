import type { AnyProcedure, AnyRouter } from '@trpc/server';

export type AppRouter = AnyRouter;
export type AppProcedure = AnyProcedure;

export interface TRPCErrorShape {
  code: string;
  message: string;
  data?: {
    code: string;
    httpStatus: number;
    stack?: string;
    path?: string;
  };
}

export interface TRPCSuccessShape<T> {
  result: {
    data: T;
  };
}
