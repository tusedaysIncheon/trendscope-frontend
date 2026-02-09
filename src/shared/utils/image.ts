export const getFullImageUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;

    const cdnBase = import.meta.env.VITE_CDN_BASE_URL;
    // cdnBase가 없거나 path가 이미 슬래시로 시작하는 경우 등에 대한 방어 로직 추가 가능하지만
    // 현재는 단순 결합
    return `${cdnBase}/${path}`;
};
