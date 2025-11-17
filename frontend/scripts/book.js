export class Book {
    constructor(data) {
        if (data.pagesRead > data.pages)
            data.pagesRead = data.pages;
        data.finished = (data.pagesRead >= data.pages);
        this.data = data;
    }
    currentlyAt() {
        if (!this.data.pages || this.data.pages <= 0)
            return 0;
        return Math.round((this.data.pagesRead / this.data.pages) * 100);
    }
    checkFinish() {
        this.data.finished = (this.data.pagesRead >= this.data.pages);
    }
    toPayload() {
        this.checkFinish();
        return {
            title: this.data.title,
            author: this.data.author,
            pages: this.data.pages,
            status: this.data.status,
            price: this.data.price,
            pagesRead: this.data.pagesRead,
            format: this.data.format,
            suggestedBy: this.data.suggestedBy,
            finished: this.data.finished
        };
    }
    async deleteBook(apiBase) {
        if (!this.data._id)
            throw new Error('Cannot delete: no id');
        const res = await fetch(`${apiBase}/books/${this.data._id}`, { method: 'DELETE' });
        if (!res.ok)
            throw new Error('Delete failed');
        return true;
    }
}
