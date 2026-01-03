# Troubleshooting

[← Back to Documentation Home](../README.md)

Run into a problem? Check here first.

## Development Issues

### Application Won't Start

**Problem**: `npm run dev` fails to start the development server

**Try these fixes**:

Check your Node version (`node --version`) – you need v18 or newer. If that's fine, try clearing dependencies and reinstalling: `rm -rf node_modules package-lock.json && npm install`. You might also need to clear Vite's cache with `rm -rf node_modules/.vite`.

### Hot Module Replacement Not Working

**Problem**: Changes don't reflect without manual refresh

**Solutions**:

1. **Check file watching limits (Linux)**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Disable browser extensions**
   - Some extensions interfere with HMR
   - Test in incognito mode

3. **Check WSL file system (Windows)**
   - Files must be in WSL file system, not Windows
   - Move project to `/home/user/` instead of `/mnt/c/`

### Import Errors

**Problem**: `Cannot find module '@/components/...'`

**Solutions**:

1. **Check path alias configuration**
   - Verify [tsconfig.json](../tsconfig.json) has correct paths
   - Verify [vite.config.ts](../vite.config.ts) has matching alias

2. **Restart TypeScript server in VSCode**
   - Cmd/Ctrl + Shift + P
   - "TypeScript: Restart TS Server"

3. **Check file extension**
   - Use `.tsx` for components with JSX
   - Use `.ts` for utilities

## Build Issues

### Build Fails

**Problem**: `npm run build` produces errors

**Solutions**:

1. **Check TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```
   Fix all TypeScript errors.

2. **Check for unused imports**
   - Remove unused imports
   - ESLint may catch these

3. **Check environment variables**
   - Ensure all `VITE_*` variables are defined
   - See [Environment Configuration](./environment.md)

4. **Increase memory limit**
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```

### Large Bundle Size

**Problem**: Production bundle is too large

**Solutions**:

1. **Analyze bundle**
   ```bash
   npm install -D rollup-plugin-visualizer
   ```
   Add to `vite.config.ts`:
   ```typescript
   import { visualizer } from 'rollup-plugin-visualizer';
   
   export default defineConfig({
     plugins: [visualizer()],
   });
   ```

2. **Lazy load routes**
   ```typescript
   const Admin = lazy(() => import('./pages/Admin'));
   ```

3. **Check dependencies**
   - Remove unused dependencies
   - Use lighter alternatives
   - Check for duplicate packages

## Testing Issues

### Tests Failing

**Problem**: Tests fail unexpectedly

**Solutions**:

1. **Clear test cache**
   ```bash
   npm test -- --clearCache
   ```

2. **Check MSW setup**
   - Ensure MSW handlers are defined
   - Check `src/setupTests.ts` is configured
   - Verify handlers match API endpoints

3. **Check async operations**
   - Use `waitFor` for async updates
   - Use `findBy` queries instead of `getBy` for async elements

4. **Check test isolation**
   - Each test should be independent
   - Use `beforeEach` to reset state
   - Don't share mutable state between tests

### MSW Not Working in Tests

**Problem**: API mocks not intercepting requests

**Solutions**:

1. **Check MSW setup in setupTests.ts**
   ```typescript
   import { server } from './mocks/server';
   
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

2. **Check handler URLs**
   - Must match actual API calls
   - Include full path: `/api/opportunities`

3. **Reset handlers between tests**
   ```typescript
   afterEach(() => server.resetHandlers());
   ```

## API Integration Issues

### CORS Errors

**Problem**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:

1. **Configure Vite proxy** (development)
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:8080',
           changeOrigin: true,
         },
       },
     },
   });
   ```

2. **Enable CORS on backend**
   - Configure API Gateway to allow origin
   - Add CORS headers to responses

3. **Use MSW in development**
   - MSW bypasses CORS
   - See [API Integration](./api-integration.md)

### API Requests Failing

**Problem**: API requests return errors

**Solutions**:

1. **Check API Gateway is running**
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Check environment variables**
   ```bash
   echo $VITE_API_GATEWAY_URL
   ```

3. **Check network tab in browser DevTools**
   - Verify request URL
   - Check request/response headers
   - Check response status and body

4. **Check authentication**
   - Ensure JWT token is included
   - Verify token is valid
   - Check token expiration

## Docker Issues

### Docker Build Fails

**Problem**: Docker image build fails

**Solutions**:

1. **Check Dockerfile syntax**
   - Verify all paths are correct
   - Check build arguments

2. **Clear Docker cache**
   ```bash
   docker build --no-cache -t techconnect-web .
   ```

3. **Check build context**
   - Ensure `.dockerignore` is configured
   - Verify necessary files are included

4. **Check disk space**
   ```bash
   docker system df
   docker system prune  # Clean up
   ```

### Container Won't Start

**Problem**: Container exits immediately

**Solutions**:

1. **Check container logs**
   ```bash
   docker logs <container-id>
   ```

2. **Check nginx configuration**
   - Verify [nginx.conf](../nginx.conf) is valid
   - Test: `nginx -t`

3. **Check port binding**
   ```bash
   # Port might be in use
   docker run -p 8081:80 techconnect-web
   ```

4. **Run interactively for debugging**
   ```bash
   docker run -it techconnect-web sh
   ```

## Performance Issues

### Slow Initial Load

**Solutions**:

1. **Enable code splitting**
   ```typescript
   const Route = lazy(() => import('./pages/Route'));
   ```

2. **Optimize images**
   - Use WebP format
   - Compress images
   - Use appropriate sizes

3. **Check bundle size**
   - See "Large Bundle Size" above

### Slow Runtime Performance

**Solutions**:

1. **Use React DevTools Profiler**
   - Identify expensive renders
   - Optimize with `React.memo`, `useMemo`, `useCallback`

2. **Check for memory leaks**
   - Cleanup in `useEffect` return
   - Abort fetch requests on unmount

3. **Optimize list rendering**
   - Use `key` prop correctly
   - Virtualize long lists (react-window)

## TypeScript Issues

### Type Errors

**Problem**: TypeScript compilation errors

**Solutions**:

1. **Check type definitions**
   ```bash
   npm install -D @types/react @types/react-dom
   ```

2. **Restart TypeScript server**
   - VSCode: Cmd/Ctrl + Shift + P → "Restart TS Server"

3. **Check tsconfig.json**
   - Verify `strict: true` and fix issues
   - Or disable strict checks (not recommended)

4. **Use type assertions carefully**
   ```typescript
   // ⚠️ Use sparingly
   const data = response as MyType;
   
   // ✅ Better: Type guards
   if (isMyType(response)) {
     // TypeScript knows the type here
   }
   ```

## Environment Variable Issues

### Variables Not Accessible

**Problem**: `import.meta.env.VITE_*` is undefined

**Solutions**:

1. **Check variable prefix**
   - Must start with `VITE_`
   - Example: `VITE_API_URL` not `API_URL`

2. **Restart development server**
   - Changes to `.env` require restart
   - Stop server (Ctrl+C) and run `npm run dev`

3. **Check .env file location**
   - Must be in project root
   - Next to `package.json`

4. **Check .env file syntax**
   ```env
   # No quotes needed
   VITE_API_URL=http://localhost:8080
   
   # Not like this
   VITE_API_URL="http://localhost:8080"
   ```

See [Environment Configuration](./environment.md) for more details.

## Browser Compatibility Issues

### Application Not Working in Specific Browser

**Solutions**:

1. **Check browser console for errors**
   - Open DevTools (F12)
   - Check Console and Network tabs

2. **Verify browser support**
   - Check `package.json` browserslist
   - Update if needed

3. **Check for missing polyfills**
   - Add polyfills for older browsers
   - Update Vite configuration

4. **Test in multiple browsers**
   - Chrome/Edge
   - Firefox
   - Safari

## Git Issues

### Merge Conflicts in package-lock.json

**Solutions**:

```bash
# Delete package-lock.json
rm package-lock.json

# Regenerate
npm install

# Add and commit
git add package-lock.json
git commit -m "Regenerate package-lock.json"
```

## Getting Help

If issues persist:

Check the other docs ([Setup](../getting-started/setup.md), [Development](./development.md), etc.) or search existing issues in the repository. When creating a bug report, include error messages, steps to reproduce, and your environment details (OS, Node version, browser).

## Common Error Messages

### "Cannot read property of undefined"

- Check for null/undefined values
- Use optional chaining: `obj?.prop`
- Add null checks

### "Maximum update depth exceeded"

- Infinite loop in `useEffect`
- Check dependency array
- Avoid setting state that triggers the effect

### "Objects are not valid as React child"

- Don't render objects directly
- Extract properties: `{user.name}` not `{user}`

### "Warning: Each child in a list should have a unique key"

- Add `key` prop to mapped elements
- Use unique, stable identifiers
- Don't use array index if list can change

## Other Resources

[Setup Guide](../getting-started/setup.md) • [Development](./development.md) • [Testing](./testing.md) • [Deployment](./deployment.md)
