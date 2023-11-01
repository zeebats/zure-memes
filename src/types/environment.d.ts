/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions */

namespace NodeJS {
    interface ProcessEnv {
        PUBLIC_SUPABASE_KEY: string | undefined;
        PUBLIC_SUPABASE_URL: string | undefined;
    }
}

interface ImportMetaEnv {
	readonly PUBLIC_SUPABASE_KEY: string | undefined;
	readonly PUBLIC_SUPABASE_URL: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
