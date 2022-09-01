package feedmon.testing.usecases;

public interface UseCase<T, R> {

    public T execute(R input);
}
