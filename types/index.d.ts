// TODO: check these types with with an TypeScript expert
import { Combine } from './combine';
import { Bloko } from './bloko';

export { Model } from './model';
export { http } from './http';
export function combine(obj: Combine) : void;
export function getState(): { [key: string]: object };
export function getBloko(): Bloko | never;

