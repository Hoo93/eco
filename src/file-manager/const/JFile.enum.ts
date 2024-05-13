import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class JFileEnum extends EnumType<JFileEnum>() {
  static readonly IMAGE = new JFileEnum('IMAGE', 'img');
  static readonly VIDEO = new JFileEnum('VIDEO', 'video');
  static readonly ETC = new JFileEnum('ETC', 'etc');

  private constructor(
    readonly code: string,
    readonly path: string,
  ) {
    super();
  }
}
