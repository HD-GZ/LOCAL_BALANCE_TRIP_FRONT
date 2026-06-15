# LOCAL_BALANCE_TRIP_FRONT GitHub Conventions

## Repository

- Repository: `HD-GZ/LOCAL_BALANCE_TRIP_FRONT`
- Default PR base: read with `gh repo view --json defaultBranchRef`; currently `develop`
- Issue forms:
  - `.github/ISSUE_TEMPLATE/task.yml`
  - `.github/ISSUE_TEMPLATE/bug.yml`
- PR template: `.github/pull_request_template.md`
- Automation: `.github/workflows/automate-issues-and-prs.yml`

The automation assigns the author when an issue or PR is opened. It reads `### 작업 유형` from task issues and checked items under `## 작업 유형` from PRs to synchronize labels.

## Work Type Mapping

| Work type | Issue kind | Issue task value | PR checkbox | Commit type | Label |
| --- | --- | --- | --- | --- | --- |
| feature | task | 기능 구현 | 기능 구현 | `feat` | `✨ Feature` |
| fix | bug | - | 버그 수정 | `fix` | `🐞 BugFix` |
| refactor | task | 리팩터링 | 리팩터링 | `refactor` | `🔨 Refactor` |
| test | task | 테스트 | 테스트 | `test` | `✅ Test` |
| docs | task | 문서 | 문서 | `docs` | `📃 Docs` |
| deploy | task | 배포 | 배포 | `chore` | `🌏 Deploy` |
| setting | task | 개발 환경 설정 | 개발 환경 설정 | `chore` | `⚙ Setting` |

Choose:

- `feature` for user-visible behavior, new pages, new UI, or new API integration.
- `fix` for broken or unexpected behavior.
- `refactor` when behavior stays the same and structure improves.
- `test` for test code or test infrastructure.
- `docs` for documentation-only changes.
- `deploy` for deployment workflow or release infrastructure.
- `setting` for dependencies, tooling, project configuration, or development environment changes.

For mixed work, select one primary type for the PR title and commits, but check every applicable PR type so all relevant labels are applied.

## Titles

Issue titles follow the issue form:

```text
[작업] 설명
[버그] 설명
```

PR titles follow the primary commit type:

```text
feat: 설명
fix: 설명
refactor: 설명
test: 설명
docs: 설명
chore: 설명
```

Write descriptions in Korean. Keep technical identifiers such as API, PR, OAuth, and component names unchanged when that is clearer.

## Branches

Use:

```text
{issue-number}-{description-kebab-case}
```

Example:

```text
12-로그인-폼-api-연결
```

Keep the branch concise. Remove punctuation, replace spaces with `-`, collapse repeated hyphens, and do not add a redundant type segment.

If the current branch already starts with an issue number, inspect and reuse that issue instead of creating another one.

## Issue Creation

Write task issue bodies with this exact structure:

```markdown
### 작업 유형

기능 구현

### 작업 내용

로그인 폼과 인증 API를 연결합니다.

### 요구사항

- 로그인 성공 시 메인 페이지로 이동
- 실패 응답 메시지 표시

### 참고 자료

- Figma 로그인 화면
```

Replace `기능 구현` with the exact mapped task value. Include at least one requirement.

Write bug issue bodies with this exact structure:

```markdown
### 버그 설명

로그인 실패 메시지가 표시되지 않습니다.

### 재현 방법

1. 잘못된 비밀번호로 로그인
2. 로그인 버튼 클릭

### 기대 동작

오류 메시지가 표시되어야 합니다.

### 실제 동작

화면에 아무 변화가 없습니다.

### 환경 정보

- 브라우저: Chrome
- 환경: 로컬
```

Bug description, reproduction steps, expected behavior, and actual behavior are required.

Create task issues without a manual label and let the workflow parse `### 작업 유형`.

For bug issues, pass `--label "🐞 BugFix"` when using `gh issue create`; YAML form metadata is not applied when a body file is submitted directly through the CLI.

Do not pass `--assignee` initially. Verify that the workflow assigned the author, then use `--add-assignee @me` only as a fallback.

## Commits

- Use `type: 한국어 설명`.
- Split by logical behavior or independently reviewable concern.
- Keep generated files with the source change that requires them.
- Keep broad formatting or dependency churn separate when it is intentional.
- Do not make an empty cleanup commit solely to increase commit count.

Examples:

```text
feat: 로그인 폼 구현
feat: 인증 API 연결
test: 로그인 폼 검증 테스트 추가
chore: 이슈 및 PR 자동화 설정
```

## Validation

Always run:

```bash
pnpm lint
pnpm type-check
```

Also run `pnpm build` when changes affect:

- `src/app` routing, layouts, pages, metadata, or server/client boundaries
- dependencies or lockfiles
- Next.js, TypeScript, PostCSS, Tailwind, or build configuration
- deployment workflows or production build behavior

Run focused tests when the repository contains relevant tests. Never check a PR checklist item for a command that was not run successfully.

## PR Creation

Start from `.github/pull_request_template.md` and write the completed body to a temporary Markdown file. Preserve this structure:

```markdown
## 개요

로그인 폼과 인증 흐름을 구현했습니다.

## 작업 유형

- [x] 기능 구현
- [ ] 리팩터링
- [x] 테스트
- [ ] 문서
- [ ] 배포
- [ ] 개발 환경 설정
- [ ] 버그 수정

## 변경 사항

- react-hook-form 기반 로그인 폼 구현
- 로그인 API 및 오류 처리 연결

## 관련 이슈

closes #12

## 스크린샷

<!-- UI 변경이 있는 경우 Before / After 스크린샷을 첨부해주세요. -->

## 체크리스트

- [x] 로컬에서 정상 동작 확인
- [x] 타입 오류 없음 (`pnpm type-check`)
- [x] 린트 오류 없음 (`pnpm lint`)
```

Keep every work type checkbox in the template. Check all applicable types. Only check validation items that actually passed.

Use `closes #<issue-number>` exactly in the related issue section. Open against the repository default branch.

The workflow supports multiple checked PR work types and applies multiple labels. It also removes managed labels when the PR body is edited and types are unchecked.

## Verification

After issue or PR creation:

1. Wait briefly for `Automate issues and pull requests`.
2. Inspect labels and assignees with `gh issue view` or `gh pr view`.
3. If missing, inspect recent workflow runs before applying a manual fallback.
4. Report whether automation or fallback produced the final state.
