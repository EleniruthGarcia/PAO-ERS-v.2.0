import type { User } from './user';
import type { Client } from './client';
import type { Service } from './service';
import type { Case } from './case';

interface ServiceWithJoins extends Service {
	lawyer: User;
	client: Client;
	interviewee: Client;
	case: Case;
}

export type { User, Client, Service, Case, ServiceWithJoins };
