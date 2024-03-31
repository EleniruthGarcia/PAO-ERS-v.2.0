// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		interface PageData {
			flash?: {
				type: 'success' | 'error' | 'description' | 'info' | 'warning' | 'error' | 'action' | 'promise' | 'loading';
				message: string,
				description?: string;
				action?: {
					label: string;
					onClick: (event: MouseEvent) => void;
				};
				promise?: PromiseT<T>;
				loading?: string;
				success?: string;
				error?: string;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
