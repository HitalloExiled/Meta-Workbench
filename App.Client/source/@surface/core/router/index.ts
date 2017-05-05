export function routeTo(path: string): void
{
    history.pushState(null, "", path);
}