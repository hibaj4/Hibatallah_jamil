import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-post-details',
  imports: [RouterModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent {
  postId!: number;
  posts = [
    { id: 1, title: 'Post 1', content: 'Contenu du post 1' },
    { id: 2, title: 'Post 2', content: 'Contenu du post 2' },
    { id: 3, title: 'Post 3', content: 'Contenu du post 3' }
  ];
  post: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.posts.find(p => p.id === this.postId);
  }

}
