import type { User } from './user';
import type { Client } from './client';
import type { Request } from './request';
import type { Case } from './case';

interface RequestWithJoins extends Request {
    lawyer: User;
    client: Client;
}

export type { User, Client, Request, Case, RequestWithJoins }