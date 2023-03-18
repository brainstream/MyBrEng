import { ThemeService } from './shared';

export function appInitializerFactory(
    theme: ThemeService
) {
    return () => {
        theme.restore();
    };
}
