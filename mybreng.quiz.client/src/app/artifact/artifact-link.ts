import {environment} from "@app/environment";

export class ArtifactLink {
    private linkUrl: string;

    constructor(id: string, private readonly filename: string) {
        this.linkUrl = environment.artifactBaseUrl + "/api/artifact/" + id;
    }

    get url(): string {
        return this.linkUrl;
    }

    get markdownImage(): string {
        return `![${this.filename}](${this.linkUrl})`;
    }

    get markdownAudio(): string {
        return `<audio controls><source src="${this.linkUrl}" type="${this.filename}"></audio>`;
    }
}
