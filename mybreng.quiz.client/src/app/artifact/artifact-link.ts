import {environment} from "@app/environment";
import {ArtifactDto} from "@app/web-api";

export class ArtifactLink {
    private linkUrl: string;

    constructor(private readonly artifact: ArtifactDto) {
        this.linkUrl = environment.artifactBaseUrl + artifact.id;
    }

    get url(): string {
        return this.linkUrl;
    }

    get markdownImage(): string {
        return `![${this.artifact.filename}](${this.linkUrl})`;
    }

    get markdownAudio(): string {
        return `<audio controls><source src="${this.linkUrl}" type="${this.artifact.mime}"></audio>`;
    }
}
