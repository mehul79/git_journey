import "dotenv/config";
export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    socialProviders: {
        github: {
            clientId: string;
            clientSecret: string;
        };
    };
    trustedOrigins: string[];
}>;
//# sourceMappingURL=auth.d.ts.map