const profileQueriesIdentity = {
    info: ['profileInfo'] as const,
    socialAccount: ['socialAccount'] as const,
    infoWithSocialAccount: () => [...profileQueriesIdentity.info, ...profileQueriesIdentity.socialAccount] as const
}

export {
    profileQueriesIdentity
}