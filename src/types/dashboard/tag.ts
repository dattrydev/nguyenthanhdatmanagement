import {UUID} from "node:crypto";

export interface Tag {
    id: UUID;
    name: string;
}