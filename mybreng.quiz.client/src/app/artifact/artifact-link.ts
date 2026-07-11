import { environment } from '@app/environment';
import { ArtifactDto } from '@app/web-api';

export class ArtifactLink {
    private readonly linkUrl: string;

    constructor(private readonly artifact: ArtifactDto) {
        this.linkUrl = environment.artifactBaseUrl + artifact.id;
    }

    public get url(): string {
        return this.linkUrl;
    }

    public get markdownImage(): string {
        return `![${this.artifact.filename}](${this.linkUrl})`;
    }

    public get markdownAudio(): string {
        return `<audio controls><source src="${this.linkUrl}" type="${this.artifact.mime}"></audio>`;
    }
}
