import { Car } from 'src/cars/entities/car.entity';
import { Posts } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  //..........relations start........//
  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  //Para la tablar user desde Review:
  // @OneToMany(() => Review, review => review.user)
  // reviews: Review[];
  //..........relations end........//

  //..........relations start ........//
  @ManyToOne(() => Posts, (posts) => posts.review, { eager: true })
  @JoinColumn({ name: 'postId' })
  post: Posts;

  //Para la tablar Posts desde Review:
  // @OneToOne(() => Review, review => review.car)
  // reviews: Review[];
  //..........relations end........//
}
