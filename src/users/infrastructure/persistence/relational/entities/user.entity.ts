import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Exclude, Expose } from 'class-transformer';
import { WorkspaceEntity } from 'src/workspaces/infrastructure/persistence/entities/workspace.entity';
import { User } from '../../../../domain/user';
import { ChannelEntity } from '../../../../../channels/infrastructure/persistence/entities/channel.entity';
import { IsDefined } from 'class-validator';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper implements User {
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ type: String, unique: true })
  @Expose({ groups: ['me', 'admin'] })
  username: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Column({ type: String, nullable: true })
  bio?: string | null;

  @ManyToMany(() => WorkspaceEntity, (workspace) => workspace.members)
  workspaces: WorkspaceEntity[];

  @Column({ type: String, nullable: true })
  statusMessage?: string | null;

  @Column({ type: String, nullable: true })
  avatarUrl?: string | null;

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @ManyToMany(() => ChannelEntity, (channel) => channel.members)
  channels: ChannelEntity[];

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
