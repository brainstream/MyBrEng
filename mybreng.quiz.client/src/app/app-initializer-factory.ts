import { ThemeService } from './common';

export function appInitializerFactory(
    theme: ThemeService
) {
    return () => {
        theme.restore();
    };
}
