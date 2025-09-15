# Cookie


## Branches

### Development - `dev`

Changes to this Branch are to be considered generally **unstable**.<br>
It is where we push code that is in active development, and so it is prone to change **at any moment**.

### Production - `prod`

Changes to this Branch reflect *immediately* (up to 5 minutes) on the project's [Website](https://cookie.overclock.pt), and are thoroughly tested before being pushed / merged.

## Development

### Tools

| Tool        | Description                           |
|-------------|---------------------------------------|
| [Node.JS](https://nodejs.org)      | JavaScript Anywhere.                        |
| [Bun](https://bun.sh)              | Fastest JS/TS Bundler & Compiler.           |
| [Git Crypt](https://github.com/AGWA/git-crypt) | GPG-based Repository Encryption.            |

### Stack

This project was initially created with [T3](https://create.t3.gg).<br>
However, we don't employ *all* of its Stack.

Here's our current Stack:
- [Next.JS](https://nextjs.org) - React's Best Offering for the Web.
- [Tailwind CSS](https://tailwindcss.com) - CSS Made Simple.
- [ShadCN](https://ui.shadcn.com/) - Clean, Minimalist & Beautiful Component Library.
- [AppWrite](https://appwrite.io/) - Open-Source Real-Time Database / Auth Backend.

## Security

The Creators do their best to employ the best [Security Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/01-introduction/05-introduction).

**All** code is thoroughly analyzed and tested to ensure there are no leaks, unintended exposures, or unidentified "exploits" that could compromise our Users' [Data](#collected--not-shared-data).

### Collected / (Not) Shared Data

We don't share **any** [PII](https://www.security.org/identity-theft/what-is-pii/).<br>
Here's what we (anonymously) collect:

| Data Type   | Purpose                      |
|-------------|-----------------------------|
| Device, IP Address & Stack Traces | Bug Reporting System |
| Last Login Time | Analytics               |
| E-mail      | Login System            |
| Username    | Account Identification  |