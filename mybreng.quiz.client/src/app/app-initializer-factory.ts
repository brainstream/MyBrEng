import { ThemeService } from './common';

export function appInitializerFactory(
    theme: ThemeService
) {
    return (): void => {
        theme.restore();
    };
}
