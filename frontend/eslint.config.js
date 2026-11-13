import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/', 'bindings/'] },
  tseslint.configs.strict,
  reactHooks.configs.flat.recommended,
)
