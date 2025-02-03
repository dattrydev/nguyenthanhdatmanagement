import {UUID} from "node:crypto";

export interface Category {
    id: UUID;
    name: string;
}