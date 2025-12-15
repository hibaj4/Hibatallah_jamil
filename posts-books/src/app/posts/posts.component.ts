import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [RouterModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  posts = [
    { id: 1, title: 'Post 1', content: 'Contenu du post 1' },
    { id: 2, title: 'Post 2', content: 'Contenu du post 2' },
    { id: 3, title: 'Post 3', content: 'Contenu du post 3' }
  ];

}
